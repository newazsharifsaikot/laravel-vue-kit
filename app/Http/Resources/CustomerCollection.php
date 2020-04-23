<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class CustomerCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'data' => $this->collection->transform(function ($collection) {
                return [
                    'id' => $collection->id,
                    'name' => $collection->name,
                    'email' => $collection->email,
                    'phone' => $collection->phone,
                    'address' => $collection->address,
                    'total' => $collection->total,
                ];
            })
        ];
    }


}
